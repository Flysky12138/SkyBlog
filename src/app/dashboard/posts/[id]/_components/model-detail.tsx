import { DrawerCore, DrawerCoreProps } from '@/components/drawer/drawer-core'
import { FormInputMultiple } from '@/components/form/form-input-multiple'
import { CustomRequest } from '@/lib/server/request'
import { FormControl, FormLabel, Input, Switch, Textarea } from '@mui/joy'
import useSWR from 'swr'
import { Updater } from 'use-immer'
import { uuidv7 } from 'uuidv7'
import { DefaultPostType } from '../page'
import { ModalChips } from './modal-chips'

interface ModelDetailProps extends Pick<DrawerCoreProps, 'component'> {
  onChange: Updater<ModelDetailProps['value']>
  value: DefaultPostType
}

export const ModelDetail = ({ component: Component, value: post, onChange: setPost }: ModelDetailProps) => {
  const { data: categories } = useSWR('0e6f0c70-c012-5c78-86b3-8ad4104132c2', () => CustomRequest('GET api/dashboard/posts/categories', {}))
  const { data: tags } = useSWR('a6f64593-cfc1-5feb-b5e7-37e15b3e67e0', () => CustomRequest('GET api/dashboard/posts/tags', {}))

  return (
    <DrawerCore component={Component}>
      <div className="flex flex-col gap-y-5">
        <FormControl required>
          <FormLabel>标题</FormLabel>
          <Input
            value={post.title}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.title = event.target.value
              })
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>描述</FormLabel>
          <Textarea
            minRows={3}
            value={post.description || ''}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.description = event.target.value || null
              })
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>分类</FormLabel>
          <FormInputMultiple
            endDecorator={
              <ModalChips
                select={post.categories}
                value={categories || []}
                onChange={payload => {
                  setPost(state => {
                    state.categories = payload
                  })
                }}
              />
            }
            getChipValue={({ name }) => name}
            value={post.categories}
            onAdd={name => {
              setPost(state => {
                state.categories.push({ name, id: uuidv7() })
              })
            }}
            onDelete={names => {
              setPost(state => {
                state.categories = state.categories.filter(({ name }) => !names.includes(name))
              })
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>标签</FormLabel>
          <FormInputMultiple
            endDecorator={
              <ModalChips
                select={post.tags}
                value={tags || []}
                onChange={payload => {
                  setPost(state => {
                    state.tags = payload
                  })
                }}
              />
            }
            getChipValue={({ name }) => name}
            value={post.tags}
            onAdd={name => {
              setPost(state => {
                state.tags.push({ name, id: uuidv7() })
              })
            }}
            onDelete={names => {
              setPost(state => {
                state.tags = state.tags.filter(({ name }) => !names.includes(name))
              })
            }}
          />
        </FormControl>
        <FormControl className="w-32">
          <FormLabel className="shrink-0">置顶</FormLabel>
          <Input
            type="number"
            value={post.sticky}
            variant="outlined"
            onChange={event => {
              setPost(state => {
                state.sticky = Math.max(0, Number.parseInt(event.target.value || '0'))
              })
            }}
            onFocus={event => event.target.select()}
          />
        </FormControl>
        <FormControl className="grow-0" orientation="horizontal">
          <FormLabel>显示标题卡片</FormLabel>
          <Switch
            checked={post.showTitleCard}
            className="ml-1"
            color={post.showTitleCard ? 'success' : 'neutral'}
            size="lg"
            onChange={event => {
              setPost(state => {
                state.showTitleCard = event.target.checked
              })
            }}
          />
        </FormControl>
      </div>
    </DrawerCore>
  )
}
