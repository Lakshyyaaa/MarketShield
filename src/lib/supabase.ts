import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co"
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  watchlist: string[];
  last_login?: string;
  created_at?: string;
}

export interface DbCommunityPost {
  id: string;
  user_email: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  author_image?: string | null;
  stock_tag: string;
  content: string;
  likes_count: number;
  dislikes_count: number;
  reposts_count: number;
  bookmarks_count: number;
  is_flagged: boolean;
  flag_reason?: string | null;
  created_at: string;
  user_interactions?: {
    isLiked?: boolean;
    isDisliked?: boolean;
    isReposted?: boolean;
    isBookmarked?: boolean;
  };
}

export interface DbCommunityReply {
  id: string;
  post_id: string;
  user_email: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  author_image?: string | null;
  content: string;
  likes_count: number;
  created_at: string;
}

export const DEFAULT_WATCHLIST = [
  "^NSEI",
  "RELIANCE.NS",
  "TCS.NS",
  "HDFCBANK.NS",
  "INFY.NS",
];

// ==============================================================================
// USER PROFILE & 5-STOCK WATCHLIST OPERATIONS
// ==============================================================================

export async function syncUserProfile(user: {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<UserProfile> {
  const userId = user.id || user.email;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (existing && !fetchErr) {
        // Update last login
        const { data: updated } = await supabase
          .from("profiles")
          .update({
            name: user.name || existing.name,
            avatar_url: user.image || existing.avatar_url,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("email", user.email)
          .select()
          .single();

        return (
          updated || {
            id: existing.id,
            email: existing.email,
            name: existing.name,
            avatar_url: existing.avatar_url,
            watchlist: existing.watchlist || DEFAULT_WATCHLIST,
          }
        );
      }

      // Insert new profile
      const newProfile = {
        id: userId,
        email: user.email,
        name: user.name || "Investor",
        avatar_url: user.image || null,
        watchlist: DEFAULT_WATCHLIST,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertErr } = await supabase
        .from("profiles")
        .insert([newProfile])
        .select()
        .single();

      if (!insertErr && inserted) {
        return inserted;
      }
    } catch (e) {
      console.warn("[Supabase] Profile sync fallback to local storage:", e);
    }
  }

  // Local storage fallback
  if (typeof window !== "undefined") {
    try {
      const localKey = `ms_profile_${user.email}`;
      const cached = localStorage.getItem(localKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.name = user.name || parsed.name;
        parsed.avatar_url = user.image || parsed.avatar_url;
        localStorage.setItem(localKey, JSON.stringify(parsed));
        return parsed;
      }
      const initial: UserProfile = {
        id: userId,
        email: user.email,
        name: user.name || "Investor",
        avatar_url: user.image || null,
        watchlist: DEFAULT_WATCHLIST,
      };
      localStorage.setItem(localKey, JSON.stringify(initial));
      return initial;
    } catch (e) {
      // ignore
    }
  }

  return {
    id: userId,
    email: user.email,
    name: user.name || "Investor",
    avatar_url: user.image || null,
    watchlist: DEFAULT_WATCHLIST,
  };
}

export async function saveUserWatchlist(
  email: string,
  watchlist: string[]
): Promise<string[]> {
  const cleanList = watchlist.slice(0, 5);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          watchlist: cleanList,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (!error) return cleanList;
    } catch (e) {
      console.warn("[Supabase] Watchlist update error, using local fallback:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const localKey = `ms_profile_${email}`;
      const cached = localStorage.getItem(localKey);
      const profile = cached ? JSON.parse(cached) : { email, watchlist: cleanList };
      profile.watchlist = cleanList;
      localStorage.setItem(localKey, JSON.stringify(profile));
    } catch (e) {
      // ignore
    }
  }

  return cleanList;
}

// ==============================================================================
// COMMUNITY POSTS, INTERACTIONS & REPLIES OPERATIONS
// ==============================================================================

export async function fetchDbCommunityPosts(currentUserEmail?: string): Promise<DbCommunityPost[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: posts, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && posts && posts.length > 0) {
        if (currentUserEmail) {
          const { data: interactions } = await supabase
            .from("community_post_interactions")
            .select("post_id, interaction_type")
            .eq("user_email", currentUserEmail);

          const interMap: Record<string, Record<string, boolean>> = {};
          (interactions || []).forEach((inter) => {
            if (!interMap[inter.post_id]) interMap[inter.post_id] = {};
            interMap[inter.post_id][inter.interaction_type] = true;
          });

          return posts.map((p) => ({
            ...p,
            user_interactions: {
              isLiked: interMap[p.id]?.like || false,
              isDisliked: interMap[p.id]?.dislike || false,
              isReposted: interMap[p.id]?.repost || false,
              isBookmarked: interMap[p.id]?.bookmark || false,
            },
          }));
        }
        return posts;
      }
    } catch (e) {
      console.warn("[Supabase] Community posts fetch error, using local cache:", e);
    }
  }

  // Fallback to local storage or null
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("ms_community_posts");
      if (local) return JSON.parse(local);
    } catch (e) {
      // ignore
    }
  }

  return [];
}

export async function createDbCommunityPost(post: {
  user_email: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  author_image?: string | null;
  stock_tag: string;
  content: string;
  is_flagged?: boolean;
  flag_reason?: string | null;
}): Promise<DbCommunityPost | null> {
  const newPost = {
    user_email: post.user_email,
    author_name: post.author_name,
    author_handle: post.author_handle,
    author_avatar: post.author_avatar,
    author_image: post.author_image || null,
    stock_tag: post.stock_tag,
    content: post.content,
    likes_count: 0,
    dislikes_count: 0,
    reposts_count: 0,
    bookmarks_count: 0,
    is_flagged: post.is_flagged || false,
    flag_reason: post.flag_reason || null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .insert([newPost])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] Create post error, storing locally:", e);
    }
  }

  // Fallback local storage
  const mockPost: DbCommunityPost = {
    ...newPost,
    id: `local-${Date.now()}`,
  };
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("ms_community_posts");
      const list: DbCommunityPost[] = local ? JSON.parse(local) : [];
      list.unshift(mockPost);
      localStorage.setItem("ms_community_posts", JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }

  return mockPost;
}

export async function toggleDbPostInteraction(
  postId: string,
  userEmail: string,
  type: "like" | "dislike" | "repost" | "bookmark"
): Promise<{ added: boolean }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase
        .from("community_post_interactions")
        .select("id")
        .eq("post_id", postId)
        .eq("user_email", userEmail)
        .eq("interaction_type", type)
        .single();

      if (existing) {
        // Remove interaction
        await supabase
          .from("community_post_interactions")
          .delete()
          .eq("id", existing.id);

        const col = `${type}s_count`;
        const { data: current } = await supabase
          .from("community_posts")
          .select(col)
          .eq("id", postId)
          .single();
        const curCount = (current as any)?.[col] || 1;
        await supabase
          .from("community_posts")
          .update({ [col]: Math.max(0, curCount - 1) })
          .eq("id", postId);

        return { added: false };
      } else {
        // Add interaction
        await supabase.from("community_post_interactions").insert([
          {
            post_id: postId,
            user_email: userEmail,
            interaction_type: type,
          },
        ]);

        const col = `${type}s_count`;
        const { data: current } = await supabase
          .from("community_posts")
          .select(col)
          .eq("id", postId)
          .single();
        const curCount = (current as any)?.[col] || 0;
        await supabase
          .from("community_posts")
          .update({ [col]: curCount + 1 })
          .eq("id", postId);

        return { added: true };
      }
    } catch (e) {
      console.warn("[Supabase] Interaction error:", e);
    }
  }

  return { added: true };
}

export async function fetchDbPostReplies(postId: string): Promise<DbCommunityReply[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("community_replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] Fetch replies error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const key = `ms_replies_${postId}`;
      const local = localStorage.getItem(key);
      if (local) return JSON.parse(local);
    } catch (e) {
      // ignore
    }
  }

  return [];
}

export async function createDbPostReply(reply: {
  post_id: string;
  user_email: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  author_image?: string | null;
  content: string;
}): Promise<DbCommunityReply | null> {
  const newReply = {
    post_id: reply.post_id,
    user_email: reply.user_email,
    author_name: reply.author_name,
    author_handle: reply.author_handle,
    author_avatar: reply.author_avatar,
    author_image: reply.author_image || null,
    content: reply.content,
    likes_count: 0,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("community_replies")
        .insert([newReply])
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn("[Supabase] Create reply error:", e);
    }
  }

  const mockReply: DbCommunityReply = {
    ...newReply,
    id: `reply-${Date.now()}`,
  };

  if (typeof window !== "undefined") {
    try {
      const key = `ms_replies_${reply.post_id}`;
      const local = localStorage.getItem(key);
      const list: DbCommunityReply[] = local ? JSON.parse(local) : [];
      list.push(mockReply);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }

  return mockReply;
}
