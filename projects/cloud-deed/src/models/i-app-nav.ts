export interface IAppNav {
    name: string;
    url: string;
    icon?: string;
    iconType?: "mat-icon" | "image";
    recentnav?: boolean;
}

export function GetAppNavs(): Array<IAppNav> {
    return [
        { name: 'navigation.organization', url: '/app/ids/organization-list', icon: "device_hub", iconType: 'mat-icon', recentnav: true }
        , { name: 'navigation.account', url: '/app/ids/identity-list', icon: "perm_identity", recentnav: true }
        // , { name: 'navigation.systemRole', url: '/app/basic/role', icon: "supervisor_account", recentnav: true }
        // , { name: 'navigation.customRole', url: '/app/basic/custom-role', icon: "supervisor_account", recentnav: true }
        // , { name: 'navigation.accessPoint', url: '/app/basic/access-point', icon: "lock", recentnav: true }
        // , { name: 'navigation.personalSetting', url: '/app/basic/personal-setting', icon: "settings", recentnav: true }
        // , { name: 'navigation.staticMesh', url: '/app/morejee/staticmesh', icon: "business", recentnav: true }
        // , { name: 'navigation.material', url: '/app/morejee/material', icon: "healing", recentnav: true }
        // , { name: 'navigation.product', url: '/app/morejee/product', icon: "shopping_basket", recentnav: true }
        // , { name: 'navigation.category', url: '/app/morejee/category', icon: "timeline", recentnav: true }
        // , { name: 'navigation.map', url: '/app/morejee/map', icon: "map", recentnav: true }
        // , { name: 'navigation.solution', url: '/app/morejee/solution', icon: "note", recentnav: true }
        // , { name: 'navigation.texture', url: '/app/morejee/texture', icon: "rounded_corner", recentnav: true }
        // , { name: 'navigation.productPermissionGroup', url: '/app/morejee/product-permission-group', icon: "scatter_plot", recentnav: true }
        // , { name: 'navigation.order', url: '/app/oms/order', icon: "shopping_cart", recentnav: true }
        // , { name: 'navigation.customer', url: '/app/oms/customer', icon: "supervisor_account", recentnav: true }
        // , { name: 'navigation.fileAsset', url: '/app/oss/file', icon: "folder", recentnav: true }

    ];
}

export function GetMapNav(url: string, classifyDetailToListNav = true): IAppNav {
    if (!url) return;
    let nav = GetAppNavs().filter(x => x.url == url)[0];
    if (!nav && classifyDetailToListNav) {
        let idx = url.indexOf('/detail');
        let main = url.slice(0, idx);
        return GetAppNavs().filter(x => x.url == main)[0];
    }//if
    return nav;
}//getMapNav

export function GetMapNavs(urls: string[]): IAppNav[] {
    let navs: IAppNav[] = [];
    for (let i = 0, len = urls.length; i < len; i++) {
        let nv = GetMapNav(urls[i]);
        if (nv)
            navs.push(nv);
    }
    return navs;
}//getMapNavs
