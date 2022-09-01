/*
 *   Copyright OpenSearch Contributors
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import {
  IRouter,
  CoreSetup,
  ILegacyClusterClient,
  Logger,
  SessionStorageFactory,
} from 'opensearch-dashboards/server';
import { AuthType } from '../../common';
import {
  BasicAuthentication,
  JwtAuthentication,
  OpenIdAuthentication,
  ProxyAuthentication,
  SamlAuthentication,
  MultipleAuthentication,
} from './types';
import { SecuritySessionCookie } from '../session/security_cookie';
import { IAuthenticationType, IAuthHandlerConstructor } from './types/authentication_type';
import { SecurityPluginConfigType } from '..';
import { MultiAuthRoutes } from './types/multiauth/routes';

function createAuthentication(
  ctor: IAuthHandlerConstructor,
  config: SecurityPluginConfigType,
  sessionStorageFactory: SessionStorageFactory<SecuritySessionCookie>,
  router: IRouter,
  esClient: ILegacyClusterClient,
  coreSetup: CoreSetup,
  // authArr: string[],
  logger: Logger
): IAuthenticationType {
  // return new ctor(config, sessionStorageFactory, router, esClient, coreSetup, authArr, logger);
  return new ctor(config, sessionStorageFactory, router, esClient, coreSetup, logger);
}

export function getAuthenticationHandler(
  authType: string,
  router: IRouter,
  config: SecurityPluginConfigType,
  core: CoreSetup,
  esClient: ILegacyClusterClient,
  securitySessionStorageFactory: SessionStorageFactory<SecuritySessionCookie>,
  logger: Logger
): IAuthenticationType {
  console.log('authType');
  console.log(authType);
  const authArr = authType.split(',');
  console.log('authArr');
  console.log(authArr);

  let authHandlerType: IAuthHandlerConstructor;
  if (authArr.length === 1) {
    switch (authArr[0]) {
      case '':
      case AuthType.BASIC:
        console.log('Create Basic Router');
        authHandlerType = BasicAuthentication;
        break;
      case AuthType.OPEN_ID:
        console.log('Create OPENID Router');
        authHandlerType = OpenIdAuthentication;
        break;
      case AuthType.SAML:
        console.log('Create SAML Router');
        authHandlerType = SamlAuthentication;
        break;
      default:
        throw new Error(`Unsupported authentication type: ${authArr[0]}`);
    }
  } else {
    authHandlerType = MultipleAuthentication;
  }

  const auth: IAuthenticationType = createAuthentication(
    authHandlerType,
    config,
    securitySessionStorageFactory,
    router,
    esClient,
    core,
    // authArr,
    logger
  );

  return auth;
}
