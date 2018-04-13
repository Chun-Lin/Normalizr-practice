import { normalize, schema, Entity, denormalize } from 'normalizr'
import { omit } from 'lodash'

/** normalizr example **/
const blogData = [
  {
    id: '1',
    title: 'My first post!',
    author: {
      id: '123',
      name: 'Paul',
    },
    comments: [
      {
        id: '249',
        content: 'Nice post!',
        commenter: {
          id: '245',
          name: 'Jane',
        },
      },
      {
        id: '250',
        content: 'Thanks!',
        commenter: {
          id: '123',
          name: 'Paul',
        },
      },
    ],
  },
  {
    id: '2',
    title: 'This other post',
    author: {
      id: '123',
      name: 'Paul',
    },
    comments: [
      {
        id: '251',
        content: 'Your other post was nicer',
        commenter: {
          id: '245',
          name: 'Jane',
        },
      },
      {
        id: '252',
        content: 'I am a spammer!',
        commenter: {
          id: '245',
          name: 'Jane',
        },
      },
    ],
  },
  {
    id: '3',
    title: 'This other post',
    author: {
      id: '247',
      name: 'Spambot5',
    },
    comments: [
      {
        id: '253',
        content: 'post was nicer',
        commenter: {
          id: '245',
          name: 'Jane',
        },
      },
      {
        id: '254',
        content: 'I am a Winner!',
        commenter: {
          id: '246',
          name: 'Spambot5000',
        },
      },
    ],
  },
]




//mergeStrategy：相同的id value做merge，資料較新的會蓋過舊的資料，因此需要另外宣告exception
//如下面的posts和comments，新的posts和comments會壓過舊的，因此需要concat新的資料
const userMergeStrategy = (entityA, entityB) => {
  return {
    ...entityA,
    ...entityB,
    posts: [...(entityA.posts || []), ...(entityB.posts || [])],
    comments: [...(entityA.comments || []), ...(entityB.comments || [])],
  }
}


// processStrategy：能夠預處理entity，可以利用processStrategy新增新data
// value: entity的input value
// parent: input data的parent object
// key: parent object的key
const userProcessStrategy = (value, parent, key) => {
  switch (key) {
    case 'author':
      return { ...value, posts: [parent.id] }
    case 'commenter':
      return { ...value, comments: [parent.id] }
    default:
      return { ...value }
  }
}

const userSchema = new schema.Entity(
  'users',
  {},
  {
    processStrategy: userProcessStrategy,
    mergeStrategy: userMergeStrategy
  },
)

const commentSchema = new schema.Entity('comments', {
  commenter: userSchema,
})

const postSchema = new schema.Entity('posts', {
  author: userSchema,
  comments: [commentSchema],
})

const normalizedData = normalize(blogData, [postSchema])
const normalizedOutput = JSON.stringify(normalizedData, null, 2)
console.log(normalizedOutput)

const denormalizedData = denormalize(
  [1, 2, 3],
  [postSchema],
  normalizedData.entities,
)
const denormalizeOutput = JSON.stringify(denormalizedData, null, 2)
// console.log(denormalizeOutput)
