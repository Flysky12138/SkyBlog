import { Alert } from '@mui/material'
import dynamic from 'next/dynamic'
import { Code } from '../element/code'

interface MdxProps {
  path: string
}

export const Mdx = ({ path }: MdxProps) => {
  const Componet = dynamic(() =>
    import(`@/mdx/${path}`).catch(() => (
      <Alert severity="error">
        导入 <Code>{`@/mdx/${path}`}</Code> 失败
      </Alert>
    ))
  )

  return <Componet />
}
