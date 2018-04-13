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

const userSchema = new schema.Entity('users')

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
