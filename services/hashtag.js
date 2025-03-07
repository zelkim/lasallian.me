import Post from '../models/Post.js';

/**
 * Extracts hashtags from a given text body.
 *
 * @param {string} body - The text from which hashtags will be extracted.
 * @returns {string[]} An array of extracted hashtags.
 */
export const parseHashtags = (body) => {
    try {
        const text = typeof body === 'object' ? body.text : body;

        if (typeof text !== 'string') {
            return [];
        }
        const hashtags = text.match(/#[a-zA-Z0-9_]+/g);

        return hashtags ? hashtags.map(tag => ({ tag })) : [];
    }
    catch (err) {
        console.error('Error parsing hashtags:', err);
        return [];
    }
};

/**
 * Searches for hashtags that start with the given query.
 *
 * @param {string} query - The hashtag prefix to search for.
 * @returns {Promise<{tag: string, posts: number}[]>} A promise resolving to an array of matching hashtags and their post count.
 */
export const searchHashtags = async (req, res) => {
    try {
        const { hashtag } = req.params;

        const searchTerm = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

        // const regex = new RegExp(`^${query}`, 'i');

        const result = await Post.aggregate([
            { $unwind: '$hashtags' },
            {
                $match: {
                    'hashtags.tag': {
                        $regex: `^${searchTerm}`,
                        $options: 'i'
                    }
                }
            },
            {
                $group: {
                    _id: '$hashtags.tag',
                    count: { $sum: 1 },
                    posts: {
                        $push: {
                            postId: '$_id',
                            title: '$title',
                            type: '$type',
                            visibility: '$visibility'
                        }
                    }
                },
            },
            {
                $project: {
                    _id: 0,
                    tag: '$_id',
                    postCount: '$count',
                    posts: '$posts'
                },
            },
            { $sort: { postCount: -1 } }
        ]);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error searching hashtags:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
