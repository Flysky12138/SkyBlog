import { SerializeOptions } from 'next-mdx-remote/dist/types'
import rehypeKatex, { Options as RehypeKatexOptions } from 'rehype-katex'
import rehypePrettyCode, { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { rehypeCode } from './rehype/rehype-code'

const rehypeKatexOptions: RehypeKatexOptions = {
  output: 'html',
  strict: false
}

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  keepBackground: false,
  theme: {
    dark: 'dark-plus',
    light: 'light-plus'
  }
}

export const serializeOptions: SerializeOptions = {
  mdxOptions: {
    rehypePlugins: [[rehypeKatex, rehypeKatexOptions], [rehypePrettyCode, rehypePrettyCodeOptions], rehypeSlug, rehypeCode],
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkDirectiveRehype]
  }
}
