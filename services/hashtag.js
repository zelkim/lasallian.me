/**
 * Extracts hashtags from a given text body.
 *
 * @param {string} body - The text from which hashtags will be extracted.
 * @returns {string[]} An array of extracted hashtags.
 */
export const parseHashtags = (body) => {
  const hashtags = body.match(/#[a-zA-Z0-9_]+/g);
  return hashtags ? hashtags : [];
};

/**
 * Searches for hashtags that start with the given query.
 *
 * @param {string} query - The hashtag prefix to search for.
 * @returns {Promise<{tag: string, posts: number}[]>} A promise resolving to an array of matching hashtags and their post count.
 */
export const searchHashtags = async (query) => {
  const regex = new RegExp(`^${query}`, "i");

  const result = await Post.aggregate([
    { $unwind: "$hashtags" },
    {
      $match: { "hashtags.tag": regex },
    },
    {
      $group: {
        _id: "$hashtags.tag",
        posts: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        tag: "$_id",
        posts: 1,
      },
    },
  ]);

  return result;
};
