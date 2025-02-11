import { AccordionSummaryProps, AccordionSummary as JoyAccordionSummary } from '@mui/joy'

export const AccordionSummary = ({ children, ...props }: AccordionSummaryProps) => {
  return (
    <JoyAccordionSummary
      slotProps={{
        button: {
          className: '[&>*]:m-0'
        }
      }}
      {...props}
    >
      {children}
    </JoyAccordionSummary>
  )
}
