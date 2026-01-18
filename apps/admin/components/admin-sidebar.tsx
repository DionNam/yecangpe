'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  FileText,
  Clock,
  Users,
  Briefcase,
  Settings,
} from 'lucide-react'

const menuItems = [
  {
    title: '공고 관리',
    items: [
      { title: '전체 공고', url: '/posts', icon: FileText },
      { title: '승인 대기', url: '/posts/pending', icon: Clock },
    ],
  },
  {
    title: '사용자 관리',
    items: [
      { title: '구직자 목록', url: '/users/seekers', icon: Users },
      { title: '구인자 목록', url: '/users/employers', icon: Briefcase },
    ],
  },
  {
    title: '설정',
    items: [
      { title: '지표 설정', url: '/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="font-bold text-lg">
          관리자 패널
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
