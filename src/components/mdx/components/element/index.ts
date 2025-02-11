import { A } from './a'
import { Code } from './code'
import * as heading from './heading'
import { Img } from './img'
import { Pre } from './pre'

export const element = {
  a: A,
  code: Code,
  ...heading,
  img: Img,
  pre: Pre
}
