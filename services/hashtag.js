export const parseHashtags = (body) => {
  const hashtags = body.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches : [];
};

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
