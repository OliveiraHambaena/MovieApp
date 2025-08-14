import { supabase } from "../supabaseClient";

// Add favorite
export async function addFavorite(userId, movieId, type = "movie") {
  const { error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, movie_id: movieId, type }]);
  return { error };
}

// Remove favorite
export async function removeFavorite(userId, movieId) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId);
  return { error };
}

// Get all favorites for a user
export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("movie_id, type")
    .eq("user_id", userId);
  return { data, error };
}