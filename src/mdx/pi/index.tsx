'use client'

import { ModalCore } from '@/components/modal/modal-core'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { download } from '@/lib/file/download'
import { Alert } from '@mui/material'
import { Download, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useMeasure, useScrollbarWidth } from 'react-use'
import { FixedSizeList } from 'react-window'
import { useImmer } from 'use-immer'
import Arctan from './arctan.mdx'
import ChudnovskyBsCode from './chudnovsky-bs-code.mdx'
import ChudnovskyBs from './chudnovsky-bs.mdx'
import ChudnovskyCode from './chudnovsky-code.mdx'
import Chudnovsky from './chudnovsky.mdx'
import Label from './label.mdx'

type ModeType = 'arctan' | 'chudnovsky' | 'chudnovsky-bs'

const OPTIONS: Record<ModeType, number[]> = {
  arctan: [],
  chudnovsky: [1e4, 1e5, 1e6],
  'chudnovsky-bs': [1e4, 1e5, 1e6, 5e6, 1e7, 3e7, 5e7, 7e7, 1e8]
}

export default function Pi() {
  const [form, setForm] = useImmer<{ mode: ModeType; size: number }>({
    mode: 'chudnovsky-bs',
    size: 1e4
  })

  const [result, setResult] = React.useState<{ error: Error; pi: string; time: number } | null>(null)
  const [loading, setLoading] = React.useState(false)
  const workerRef = React.useRef<Worker>(null)
  React.useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = ({ data }) => {
      setResult(data)
      setLoading(false)
    }
    workerRef.current = worker
    return () => {
      worker.terminate()
    }
  }, [])

  const [sectionRef, { width }] = useMeasure<HTMLElement>()
  const [fontRef, { width: fontWidth }] = useMeasure<HTMLElement>()
  const scrollbarWidth = useScrollbarWidth() || 0
  const piStr = React.useMemo(() => {
    if (!result?.pi) return []
    const ans = []
    const pi = result.pi
    const interval = Math.floor((width - scrollbarWidth) / fontWidth - 3)
    for (let i = 0; i < pi.length; i += interval) {
      ans.push(pi.slice(i, i + interval))
    }
    return ans
  }, [fontWidth, result, scrollbarWidth, width])

  return (
    <section ref={sectionRef} className="flex flex-col gap-y-3">
      <div className="flex gap-4">
        <Select
          defaultValue={form.mode}
          onValueChange={(mode: ModeType) => {
            setForm(state => {
              state.mode = mode
              if (!OPTIONS[mode].includes(state.size)) {
                state.size = Math.min(...OPTIONS[mode])
              }
            })
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="arctan">
              <Label />
            </SelectItem>
            <SelectItem value="chudnovsky">Chudnovsky</SelectItem>
            <SelectItem value="chudnovsky-bs">Chudnovsky - BS</SelectItem>
          </SelectContent>
        </Select>
        {form.mode != 'arctan' && (
          <>
            <Select
              defaultValue={String(form.size)}
              onValueChange={value => {
                if (!value) return
                setForm(state => {
                  state.size = Number(value)
                })
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS[form.mode].map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option.toExponential().replace('+', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ModalCore
              className="s-bg-root p-0 [&_figure]:s-hidden-scrollbar [&_figure]:overflow-auto [&_pre]:bg-transparent"
              component={props => (
                <Button variant="outline" {...props}>
                  源码
                </Button>
              )}
            >
              {form.mode == 'chudnovsky' && <ChudnovskyCode />}
              {form.mode == 'chudnovsky-bs' && <ChudnovskyBsCode />}
            </ModalCore>
            <Button
              className="grow"
              disabled={loading}
              onClick={() => {
                setResult(null)
                workerRef.current?.postMessage(form)
                setLoading(true)
              }}
            >
              {loading && <Loader2 className="animate-spin" />}
              计算
            </Button>
          </>
        )}
      </div>
      {form.mode == 'arctan' && (
        <Alert className="mt-2 py-px" severity="warning">
          收敛速度太慢，不提供计算
        </Alert>
      )}
      <span ref={fontRef} aria-hidden="true" className="invisible absolute h-0 self-start font-code">
        3
      </span>
      {result ? (
        result.error ? (
          <Alert severity="error">{result.error.message}</Alert>
        ) : (
          <>
            <div className="flex items-center justify-end gap-x-2">
              耗时 {result.time > 1000 ? `${(result.time / 1000).toFixed(3)} 秒` : `${result.time.toFixed(1)} 毫秒`}
              <Button
                className="text-sm"
                size="sm"
                variant="secondary"
                onClick={() => {
                  const blob = new Blob([piStr.join('')], { type: 'text/plain;charset=utf-8' })
                  download(blob, `pi-${form.size}.txt`)
                }}
              >
                <Download /> 下载
              </Button>
              <Button className="text-sm" size="sm" variant="secondary" onClick={() => setResult(null)}>
                <X /> 关闭
              </Button>
            </div>
            <div className="s-bg-sheet s-border-color-card overflow-hidden rounded-lg border py-2 pl-3 font-code">
              <FixedSizeList height={400} itemCount={piStr.length} itemData={piStr} itemSize={20} overscanCount={10} width="100%">
                {({ data, style, index }) => (
                  <span key={index} style={style}>
                    {data[index]}
                  </span>
                )}
              </FixedSizeList>
            </div>
          </>
        )
      ) : null}
      <div>
        {form.mode == 'arctan' && <Arctan />}
        {form.mode == 'chudnovsky' && <Chudnovsky />}
        {form.mode == 'chudnovsky-bs' && <ChudnovskyBs />}
      </div>
      {['chudnovsky', 'chudnovsky-bs'].includes(form.mode) && (
        <Alert className="mt-5 [&_a]:block" severity="info">
          <Link href="https://pi-calculator.netlify.app/" target="_blank">
            https://pi-calculator.netlify.app/
          </Link>
          <Link href="https://www.craig-wood.com/nick/articles/pi-chudnovsky/" target="_blank">
            https://www.craig-wood.com/nick/articles/pi-chudnovsky/
          </Link>
        </Alert>
      )}
    </section>
  )
}
