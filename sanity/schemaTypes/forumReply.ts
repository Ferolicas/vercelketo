import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'forumReply',
  title: 'Forum Reply',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text'
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string'
    }),
    defineField({
      name: 'authorEmail',
      title: 'Author Email', 
      type: 'string'
    }),
    defineField({
      name: 'forumPost',
      title: 'Forum Post',
      type: 'reference',
      to: [{type: 'forumPost'}]
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime'
    })
  ]
})