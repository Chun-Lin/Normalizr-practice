import { normalize, schema } from 'normalizr'

const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....',
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
  {
    id: 'post2',
    author: { username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 'comment3',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
      {
        id: 'comment4',
        author: { username: 'user1', name: 'User 1' },
        comment: '.....',
      },
      {
        id: 'comment5',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....',
      },
    ],
  },
]

const postSchema = new schema.Entity('posts')
const commentSchema = new schema.Entity('comments')
const authorSchema = new schema.Entity(
  'authors',
  {},
  { idAttribute: 'username' },
)

postSchema.define({
  comments: Array(commentSchema),
  author: authorSchema,
})

commentSchema.define({
  author: authorSchema,
})

const postListSchema = [postSchema]
const normalizedData = normalize(blogPosts, postListSchema)

console.table(normalizedData)
