import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineShoppingCart,
	HiOutlineUsers,
	HiOutlineDocumentText,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineUserGroup,
	HiOutlineUser
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'employees',
		label: 'Employees',
		path: '/employees',
		icon: <HiOutlineUsers />
	},
	{
		key: 'teams',
		label: 'Teams',
		path: '/teams',
		icon: <HiOutlineUserGroup />
	},
	
	{
		key: 'attendance',
		label: 'Attendance',
		path: '/attendance',
		icon: <HiOutlineDocumentText />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]

export const EMP_DASHBOARD_SIDEBAR_LINKS = [
	{
		key:'mydashboard',
		label:'My Dashboard',
		path:'/employeedashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key:'myattendance',
		label:'My Attendance',
		path:'/myattendance',
		icon: <HiOutlineDocumentText />
	},
	{
		key:'myteam',
		label:'My Team',
		path:'/myteam',
		icon:<HiOutlineUserGroup />
	},
	{
		key:'myprofile',
		label:'My Profile',
		path:'/myprofile',
		icon: <HiOutlineUser />
	}
	
]