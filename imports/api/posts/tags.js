import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// Tags collection for storing hashtags
export const Tags = new Mongo.Collection('tags');

// Function to extract hashtags from post text
export const extractHashtags = (text) => {
  if (!text) return [];
  
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) return [];
  
  // Remove # symbol and convert to lowercase
  return matches.map(tag => tag.substring(1).toLowerCase());
};

// Function to update tags collection
export const updateTagsCollection = async (tags, increment = true) => {

if (Meteor.isServer) {
  // Publish tags
  Meteor.publish('tags', function() {
    return Tags.find({}, { 
      sort: { count: -1 },
      limit: 50
    });
  });
  
  // Publish posts by tag
  Meteor.publish('postsByTag', function(tag) {
    return Posts.find(
      { tags: tag },
      { 
        sort: { createdAt: -1 },
        limit: 50
      }
    );
  });
    const incValue = increment ? 1 : -1;
    
    for (const tag of tags) {
      if (!tag) continue;
      
      // Find if tag exists
      const existingTag = await Tags.findOneAsync({ name: tag });
      
      if (existingTag) {
        // Update existing tag
        await Tags.updateAsync(
          { name: tag },
          { $inc: { count: incValue } }
        );
        
        // If decreasing and count would be 0, remove tag
        if (!increment && existingTag.count <= 1) {
          await Tags.removeAsync({ name: tag });
        }
      } else if (increment) {
        // Create new tag
        await Tags.insertAsync({
          name: tag,
          count: 1,
          createdAt: new Date()
        });
      }
    }
  };
}
