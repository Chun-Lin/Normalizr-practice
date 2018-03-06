import { normalize, schema, Entity, denormalize } from 'normalizr'
import { omit } from 'lodash'
/** normalize(data, schema) **/
// import { normalize, schema } from 'normalizr';

// const myData = { users: [ { id: 1 }, { id: 2 } ] };
// const user = new schema.Entity('users');
// const mySchema = { users: [ user ] }
// const normalizedData = normalize(myData, mySchema);

// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   result: { users: [ 1, 2 ] },
//   entities: {
//     users: {
//       '1': { id: 1 },
//       '2': { id: 2 }
//     }
//   }
// }

/** denormalize(input, schema, entities) **/
// import { denormalize, schema } from 'normalizr';

// const user = new schema.Entity('users');
// const mySchema = { users: [ user ] }
// const entities = { users: { '1': { id: 1 }, '2': { id: 2 } } };
// const denormalizedData = denormalize({ users: [ 1, 2 ] }, mySchema, entities);

// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   users: [
//     { id: 1 },
//     { id: 2 }
//   ]
// }

/** Array(definition, schemaAttribute) **/

// const data = [ { id: '123', name: 'Jim' }, { id: '456', name: 'Jane' } ];
// const userSchema = new schema.Entity('users');

// const userListSchema = new schema.Array(userSchema);
// // or use shorthand syntax:
// const userListSchema = [ userSchema ];

// const normalizedData = normalize(data, userListSchema);
// console.log(JSON.stringify(normalizedData, null, 2))

// // Output
// {
//   entities: {
//     users: {
//       '123': { id: '123', name: 'Jim' },
//       '456': { id: '456', name: 'Jane' }
//     }
//   },
//   result: [ '123', '456' ]
// }

/**
 *
 * If your input data is an array of more than one type of entity, it is necessary to define a schema mapping.
 *
 * Note: If your data returns an object that you did not provide a mapping for,
 * the original object will be returned in the result and an entity will not be created.
 *
 */
// const data = [{ id: 1, type: 'admin' }, { id: 2, type: 'user' }]

// const userSchema = new schema.Entity('users')
// const adminSchema = new schema.Entity('admins')
// const myArray = new schema.Array(
//   {
//     admins: adminSchema,
//     users: userSchema,
//   },
//   (input, parent, key) => `${input.type}s`,
// )

// const normalizedData = normalize(data, myArray)
// console.log(JSON.stringify(normalizedData, null, 2))

// // Output
// {
//   entities: {
//     admins: { '1': { id: 1, type: 'admin' } },
//     users: { '2': { id: 2, type: 'user' } }
//   },
//   result: [
//     { id: 1, schema: 'admins' },
//     { id: 2, schema: 'users' }
//   ]
// }

/** Entity(key, definition = {}, options = {}) **/

// const data = { id_str: '123', url: 'https://twitter.com', user: { id_str: '456', name: 'Jimmy' } };

// const users = new schema.Entity('user', {}, { idAttribute: 'id_str' });
// const tweet = new schema.Entity('tweets', { user: user }, {
//     idAttribute: 'id_str',
//      // Apply everything from entityB over entityA, except for "favorites"
//      mergeStrategy: (entityB, entityA) => ({
//        ...entityB,
//        ...entityA,
//       favorites: entityA.favorites
//     }),
//     // Remove the URL field from the entity
//     processStrategy: (entity) => omit(entity, 'url')
// });

// const normalizedData = normalize(data, tweet);
// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   entities: {
//     tweets: { '123': { id_str: '123', user: '456' } },
//     users: { '456': { id_str: '456', name: 'Jimmy' } }
//   },
//   result: '123'
// }

/** idAttribute Usage **/

// const data = [
//   { id: '1', guest_id: null, name: 'Esther' },
//   { id: '1', guest_id: '22', name: 'Tom' },
// ];

// const patronsSchema = new schema.Entity('patrons', undefined, {
// // idAttribute *functions* must return the ids **value** (not key)
// idAttribute: value => value.guest_id ? `${value.id}-${value.guest_id}` : value.id,
// });

// normalize(data, [patronsSchema]);
// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   entities: {
//     patrons: {
//       '1': { id: '1', guest_id: null, name: 'Esther' },
//       '1-22': { id: '1', guest_id: '22', name: 'Tom' },
//     }
//   },
//   result: ['1', '1-22']
// }

/** Object(definition) **/

// // Example data response
// const data = { users: [ { id: '123', name: 'Beth' } ] };

// const user = new schema.Entity('users');
// const responseSchema = new schema.Object({ users: new schema.Array(user) });
// // or shorthand
// const responseSchema = { users: new schema.Array(user) };

// const normalizedData = normalize(data, responseSchema);
// console.log(normalizeData)

// Output
// {
//   entities: {
//     users: { '123': { id: '123', name: 'Beth' } }
//   },
//   result: { users: [ '123' ] }
// }

/** Union(definition, schemaAttribute) **/
// const data = { owner: { id: 1, type: 'group', name: 'Anne' } }

// const user = new schema.Entity('users')
// const group = new schema.Entity('groups')
// const unionSchema = new schema.Union(
//   {
//     user: user,
//     group: group,
//   },
//   (input, parent, key) => `${input.type}`,
// )

// const normalizedData = normalize(data, { owner: unionSchema })

// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   entities: {
//     users: { '1': { id: 1, type: 'user', name: 'Anne' } }
//   },
//   result: { owner: { id: 1, schema: 'user' } }
// }

// 黑人問號??

/** Values(definition, schemaAttribute) **/
// const data = { firstThing: { id: 1 }, secondThing: { id: 2 } };

// const item = new schema.Entity('items');
// const valuesSchema = new schema.Values(item)

// const normalizedData = normalize(data, valuesSchema);
// console.log(JSON.stringify(normalizedData, null, 2))

// Output
// {
//   entities: {
//     items: { '1': { id: 1 }, '2': { id: 2 } }
//   },
//   result: { firstThing: 1, secondThing: 2 }
// }

// const blogPosts = [
//   {
//     id: 'post1',
//     author: { username: 'user1', name: 'User 1' },
//     body: '......',
//     comments: [
//       {
//         id: 'comment1',
//         author: { username: 'user2', name: 'User 2' },
//         comment: '.....',
//       },
//       {
//         id: 'comment2',
//         author: { username: 'user3', name: 'User 3' },
//         comment: '.....',
//       },
//     ],
//   },
//   {
//     id: 'post2',
//     author: { username: 'user2', name: 'User 2' },
//     body: '......',
//     comments: [
//       {
//         id: 'comment3',
//         author: { username: 'user3', name: 'User 3' },
//         comment: '.....',
//       },
//       {
//         id: 'comment4',
//         author: { username: 'user1', name: 'User 1' },
//         comment: '.....',
//       },
//       {
//         id: 'comment5',
//         author: { username: 'user3', name: 'User 3' },
//         comment: '.....',
//       },
//     ],
//   },
// ]

// const postSchema = new schema.Entity('posts')
// const commentSchema = new schema.Entity('comments')
// const authorSchema = new schema.Entity(
//   'authors',
//   {},
//   { idAttribute: 'username' },
// )

// postSchema.define({
//   comments: Array(commentSchema),
//   author: authorSchema,
// })

// commentSchema.define({
//   author: authorSchema,
// })

// const postListSchema = [postSchema]
// const normalizedData = normalize(blogPosts, postListSchema)

// console.table(normalizedData)



/** normalizr example **/
const blogData = [
  {
      "id": "1",
      "title": "My first post!",
      "author": {
          "id": "123",
          "name": "Paul"
      },
      "comments": [
          {
              "id": "249",
              "content": "Nice post!",
              "commenter": {
                  "id": "245",
                  "name": "Jane"
              }
          },
          {
              "id": "250",
              "content": "Thanks!",
              "commenter": {
                  "id": "123",
                  "name": "Paul"
              }
          }
      ]
  },
  {
      "id": "2",
      "title": "This other post",
      "author": {
          "id": "123",
          "name": "Paul"
      },
      "comments": [
          {
              "id": "251",
              "content": "Your other post was nicer",
              "commenter": {
                  "id": "245",
                  "name": "Jane"
              }
          },
          {
              "id": "252",
              "content": "I am a spammer!",
              "commenter": {
                  "id": "245",
                  "name": "Jane"
              }
          }
      ]
  },
  {
    "id": "3",
    "title": "This other post",
    "author": {
        "id": "246",
        "name": "Spambot5000"
    },
    "comments": [
        {
            "id": "253",
            "content": "post was nicer",
            "commenter": {
                "id": "245",
                "name": "Jane"
            }
        },
        {
            "id": "254",
            "content": "I am a Winner!",
            "commenter": {
                "id": "246",
                "name": "Spambot5000"
            }
        }
    ]
}
]

// processStrategy：能夠預處理entity，可以利用processStrategy新增新data
// value: entity的input value
// parent: input data的parent object
// key: parent object的key
const userProcessStrategy = (value, parent, key) => {
  switch (key) {
    case 'author':
      return { ...value, posts: [parent.id] };
    case 'commenter':
      return { ...value, comments: [parent.id] };
    default:
      return { ...value };
  }
};

// mergeStrategy：相同的id value做merge，資料較新的會蓋過舊的資料，因此需要另外宣告exception
// 如下面的posts和comments，新的posts和comments會壓過舊的，因此需要concat新的資料
const userMergeStrategy = (entityA, entityB) => {
  return {
    ...entityA,
    ...entityB,
    posts: [...(entityA.posts || []), ...(entityB.posts || [])],
    comments: [...(entityA.comments || []), ...(entityB.comments || [])]
  };
};

const user = new schema.Entity(
  'users',
  {},
  {
    mergeStrategy: userMergeStrategy,
    processStrategy: userProcessStrategy
  }
);

const comment = new schema.Entity(
  'comments',
  {
    commenter: user
  },
  {
    processStrategy: (value, parent, key) => {
      return { ...value, post: parent.id };
    }
  }
);

const post = new schema.Entity('posts', {
  author: user,
  comments: [comment]
});

const normalizedData = normalize(blogData, [post]);
const output = JSON.stringify(normalizedData, null, 2);
console.log(output)