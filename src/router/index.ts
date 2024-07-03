import { createRouter, createWebHistory } from 'vue-router'

const SigninView = () => import('../views/SigninView.vue')
const MainView = () => import('../views/MainView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const ForgetPasswordView = () => import('../views/ForgetPasswordView.vue')
const UserInfo = () => import('../components/UserInfo.vue')
const UserManage = () => import('../components/UserManage.vue')
const MedicalApply = () => import('../components/MedicalApply.vue')
const MedicalRecordsToday = () => import('../components/MedicalRecordsToday.vue')
const MedicalRecords = () => import('../components/MedicalRecords.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/signin',
            alias: ['/', '/login'],
            name: 'signin',
            component: SigninView,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/main',
            alias: '/main',
            name: 'main',
            component: MainView,
            meta: {
                title: '主页'
            },
            children: [
                {
                    path: 'userinfo',
                    name: 'userinfo',
                    alias: '/userinfo',
                    component: UserInfo,
                    meta: {
                        title: '个人信息'
                    },
                },
                {
                    path: 'usermanage',
                    name: 'usermanage',
                    alias: '/usermanage',
                    component: UserManage,
                    meta: {
                        title: '用户管理'
                    },
                },
                {
                    path: 'MedicalApply',
                    name: 'MedicalApply',
                    alias: '/MedicalApply',
                    component: MedicalApply,
                    meta: {
                        title: '预约体检'
                    },
                },
                {
                    path: 'MedicalRecordsToday',
                    name: 'MedicalRecordsToday',
                    alias: '/MedicalRecordsToday',
                    component: MedicalRecordsToday,
                    meta: {
                        title: '今日预约'
                    },
                },
                {
                    path: 'MedicalRecords',
                    name: 'MedicalRecords',
                    alias: '/MedicalRecords',
                    component: MedicalRecords,
                    meta: {
                        title: '管理体检记录'
                    },
                }
            ]
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: {
                title: '注册'
            }
        },
        {
            path: '/ForgetPassword',
            name: 'ForgetPassword',
            component: ForgetPasswordView,
            meta: {
                title: '修改密码'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    console.log(from)
    const currentUserString = localStorage.getItem('roleid')
    if (to.name !== 'signin' && to.name !== 'register' && currentUserString == null) {
        next({ path: '/signin' })
    } else {
        next()
    }
    document.title = String(to.meta.title);
})

export default router
