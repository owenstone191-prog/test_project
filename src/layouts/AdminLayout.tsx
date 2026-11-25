import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/users', label: '团队成员' },
  { to: '/projects', label: '项目管理' },
]

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sider">
        <div className="brand">
          <span className="brand-mark" aria-hidden />
          <div>
            <strong>Ops Console</strong>
            <small>Harness Demo</small>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="sider-footnote">Mock API · 配置驱动 CRUD</p>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>本地 Mock 协作模式</span>
          <span className="topbar-chip">verify 通过即可交付</span>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
