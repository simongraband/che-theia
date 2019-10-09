/********************************************************************************
 * Copyright (C) 2018-2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { ContainerModule } from 'inversify';
import { FrontendApplicationContribution, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { bindGitPreferences } from './git-preferences';
import { CheTheiaStatusBarFrontendContribution } from './status-bar-contribution';
import { CheGitNoticationClient, CheGitNoticationServer } from '../common/git-notification-proxy';

export default new ContainerModule(bind => {
    bindGitPreferences(bind);
    bind(FrontendApplicationContribution).to(CheTheiaStatusBarFrontendContribution);
    bind(CheGitNoticationClient).to(CheTheiaStatusBarFrontendContribution).inSingletonScope();

    bind(CheGitNoticationServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        const client: CheGitNoticationClient = ctx.container.get(CheGitNoticationClient);
        console.log('------------------ cleint module', client);
        return provider.createProxy<CheGitNoticationServer>('/che-git-notification', client);
    }).inSingletonScope();

});
