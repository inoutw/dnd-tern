import React, { useCallback, useEffect } from 'react';
import { Route, Switch, useLocation, useHistory, Redirect } from 'react-router-dom';

import Loading from 'components/Loading';
import NormalForm from './NormalForm';
import NormalTable from './NormalTable';
import { NormalMenu } from 'csmp-ui';
import style from './style.module.scss';
import { common } from 'assets';

export const MenuData = [
  {
    key: '/menu',
    title: '菜单管理',
    icon: 'menu'
  },
  {
    key: '/subapp',
    title: '子应用管理',
    icon: 'subapp'
  },
  {
    key: '/config-center',
    title: '配置中心',
    children: [
      {
        key: 'system-register',
        title: '应用注册'
      },
      {
        key: 'menu-setting',
        title: '菜单配置'
      }
    ]
  },
  {
    key: '/sub-system',
    title: '子应用',
    children: [
      {
        key: '/sub-system/app-react',
        title: 'app-react'
      },
      {
        key: '/sub-system/app-vue',
        title: 'app-vue'
      }
    ]
  }
];

const AppLayout: React.FC<{}> = () => {
  const location = useLocation();
  const history = useHistory();

  // const getMenu = (menus: any[]) =>
  //   menus.map((m) => {
  //     if (m.children?.length) {
  //       const subMenus: any = m.children;
  //       return (
  //         <SubMenu key={m.key} title={m.title}>
  //           {getMenu(subMenus)}
  //         </SubMenu>
  //       );
  //     } else {
  //       return <Menu.Item key={m.key}>{m.title}</Menu.Item>;
  //     }
  //   });
  useEffect(() => {
    if (location.pathname === '/app') {
      // history.push('/app/table');
    }
  }, [location, history]);

  const dataTransform = useCallback((menuData: any[]) => {
    let result = [];
    for (let item of menuData) {
      let { children, title: name, key, ...restProps } = item;
      let subMenu: any[] = [];
      if (children) {
        subMenu = dataTransform(children);
      }
      result.push({ key, subMenu, name, ...restProps });
    }
    return result
  }, [])
  return (
    <div className={style['main-container']}>
      <div className={style['menu-container']}>
        <div className={style['logo-wrap']}><img
          src={common.logo_menu}
          alt='云阵'
        /></div>
        {/* <Menu
          onClick={(value) => {
            history.push('/app' + value.key);
          }}
          style={{ width: '100%' }}
          defaultSelectedKeys={['home']}
          mode="inline">
          {getMenu(MenuData)}
        </Menu> */}
        <NormalMenu menuList={MenuData} dataTransform={dataTransform} history={history} basePath="/app" lightRouteMap={{}}></NormalMenu>
      </div>

      <div className={style['right-container']}>
        <div className={style['head-container']}></div>
        <div className={style['content-container']}>
          <div className={style['route-view-container']}>
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/app" render={() => <Redirect to="/app/home" />} />
                <Route path="/app/menu" render={() => <NormalTable />} />
                <Route path="/app/subapp" render={() => <NormalForm />} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
