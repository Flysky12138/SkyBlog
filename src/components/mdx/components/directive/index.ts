import { accordion } from './accordion'
import { Divider } from './divider'
import { Images } from './images'
import { Masonry } from './masonry'
import { Mdx } from './mdx'
import { Modal } from './modal'
import { Tabs } from './tabs'

export const directive = {
  hr: Divider,
  images: Images,
  masonry: Masonry,
  mdx: Mdx,
  modal: Modal,
  tabs: Tabs,
  ...accordion
}
