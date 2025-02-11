import { Card } from '@/components/layout/card'
import { Github, LeetCode, Spotify } from '@/components/svg-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Octokit } from '@octokit/rest'
import { Mail } from 'lucide-react'

export const CardDeveloper = async () => {
  const octokit = new Octokit()
  const { data } = await octokit.users.getByUsername({ username: process.env.NEXT_PUBLIC_GITHUB_NAME })

  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar className="size-28 bg-muted transition-transform duration-500 hover:rotate-[360deg]">
        <AvatarImage alt={data.login} loading="lazy" src={data.avatar_url.replace('https://', '/cdn/')} />
        <AvatarFallback />
      </Avatar>
      <p className="mt-3 font-title text-2xl font-normal">Flysky</p>
      <p className="mt-1 font-title text-sm text-secondary-foreground/70">{process.env.NEXT_PUBLIC_DESCRIPTION}</p>
      <Button asChild className="mt-4 w-full">
        <a href={data.html_url} target="_blank">
          <Github /> {data.login}
        </a>
      </Button>
      <div className="mt-4 flex gap-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a href="https://leetcode.cn/u/flysky12138" target="_blank">
                  <LeetCode />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>LeetCode</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a href="https://open.spotify.com/user/312ckxkwqn2ztud3zjzqwkhkqgrq" target="_blank">
                  <Spotify />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Spotify</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" variant="secondary">
                <a href="mailto:xhp443@gmail.com">
                  <Mail />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Google Email</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  )
}
