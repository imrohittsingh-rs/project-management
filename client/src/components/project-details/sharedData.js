export const STATUS_CONFIG = {
  todo: { label: 'Todo', dot: 'bg-[#8f8f8f]', badge: 'bg-[#f2f2f2] text-[#4d4d4d]' },
  in_progress: { label: 'In Progress', dot: 'bg-[#ab570a]', badge: 'bg-[#fff3e0] text-[#ab570a]' },
  done: { label: 'Done', dot: 'bg-[#13795b]', badge: 'bg-[#d9f7ec] text-[#13795b]' },
}

export const ROLE_CONFIG = {
  admin: { label: 'Admin', badge: 'bg-[#171717] text-white' },
  project_admin: { label: 'Project Admin', badge: 'bg-[#dbeeff] text-[#1554a6]' },
  member: { label: 'Member', badge: 'bg-[#f2f2f2] text-[#4d4d4d]' },
}

export const initials = (name = '') => {
  const parts = name.trim().split(' ')
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}
