import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NotaddNavigationItem } from '@notadd/types';
import { notaddAnimations } from '@notadd/animations';
import { NotaddNavigationService } from '@notadd/components/navigation/navigation.service';
import { NotaddConfigService } from '@notadd/services/config.service';
import { RoutingPathPipe } from '@notadd/pipes/routing-path.pipe';

@Component({
    selector: 'notadd-nav-collapse',
    templateUrl: './nav-collapse.component.html',
    styleUrls: ['./nav-collapse.component.scss'],
    animations: notaddAnimations,
    providers: [RoutingPathPipe]
})
export class NotaddNavCollapseComponent implements OnInit, OnDestroy {

    @Input()
    item: NotaddNavigationItem;

    @HostBinding('class')
    classes = 'nav-collapsable nav-item';

    @HostBinding('class.open')
    isCollapsed = false;

    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

    notaddConfig: any;

    subMenus: Array<any>;

    isEnterNavMenu: boolean;

    private ngUnsubscribe: Subject<any>;

    constructor(
        private navigationService: NotaddNavigationService,
        private configService: NotaddConfigService,
        private router: Router,
        private path: RoutingPathPipe
    ) {
        this.ngUnsubscribe = new Subject<any>();
        this.subMenus = [];
    }

    ngOnInit() {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((event: NavigationEnd) => {
                this.changeCollapse(!this.isUrlInChildren(this.item, event.urlAfterRedirects));
            });

        this.navigationService.onItemCollapsed
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((clickedItem) => {
                if (clickedItem && clickedItem.childMenus) {
                    if (this.isChildrenOf(this.item, clickedItem)) {
                        return;
                    }

                    if (this.isUrlInChildren(this.item, this.router.url)) {
                        return;
                    }

                    // 如果点击的item不是当前item，则折叠导航
                    if (this.item.menuId !== clickedItem.menuId) {
                        this.changeCollapse(true);
                    }
                }
            });

        this.configService.config
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((config) => {
                this.notaddConfig = config;
            });

        this.changeCollapse(this.isUrlInChildren(this.item, this.router.url));
    }

    ngOnDestroy(): void {
        // 取消订阅
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * 切换导航折叠、展开
     *
     * @param event
     */
    toggleCollapse(event): void {
        event.preventDefault();
        this.isCollapsed = !this.isCollapsed;

        this.navigationService.onItemCollapsed.next(this.item);

        this.navigationService.onItemCollapseToggled.next();
    }

    openNavMenu(event) {
        event.preventDefault();
        this.menuTrigger.openMenu();
    }

    closeNavMenu(event) {
        event.preventDefault();
        setTimeout(() => {
            !this.isEnterNavMenu && this.menuTrigger.closeMenu();
        }, 100);
    }

    /***
     * 根据isCollapsed折叠或者展开导航
     *
     * @param isCollapsed
     */
    changeCollapse(isCollapsed) {
        if (this.isCollapsed !== isCollapsed) {
            return;
        }

        this.isCollapsed = !isCollapsed;
        this.navigationService.onItemCollapseToggled.next();
    }

    /**
     * 指定的item是否包含在parent的子项中
     *
     * @param parent
     * @param item
     * @returns {boolean}
     */
    isChildrenOf(parent, item): boolean {
        if (!parent.childMenus) {
            return false;
        }

        if (~parent.childMenus.indexOf(item)) {
            return true;
        }

        for (const children of parent.childMenus) {
            if (children.childMenus) {
                return this.isChildrenOf(children, item);
            }
        }
    }

    /**
     * 指定url中是否包含在parent的children中
     *
     * @param parent
     * @param url
     * @returns {boolean}
     */
    isUrlInChildren(parent, url): boolean {
        if (!parent.childMenus) {
            return false;
        }

        for (let i = 0; i < parent.childMenus.length; i++) {
            if (parent.childMenus[i].childMenus) {
                if (this.isUrlInChildren(parent.childMenus[i], url)) {
                    return true;
                }
            }

            const childrenUrl = parent.childMenus[i].menuUrl;

            if (childrenUrl === url || url.includes(childrenUrl)) {
                return true;
            }
        }

        return false;
    }

    /* 设置子导航 */
    setSubMenu(menu) {
        this.subMenus = menu.childMenus;
    }
}
