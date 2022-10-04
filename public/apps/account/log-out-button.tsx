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

import React from 'react';
import { EuiButtonEmpty } from '@elastic/eui';
import { HttpStart } from 'opensearch-dashboards/public';
import { logout, samlLogout } from './utils';
import { AuthType, OPENID_AUTH_LOGOUT } from '../../../common';

export function LogoutButton(props: {
  authType: string[];
  http: HttpStart;
  divider: JSX.Element;
  logoutUrl?: string;
}) {
  const currentAuthType = sessionStorage.getItem('current_auth_type');

  if (
    currentAuthType === AuthType.OPEN_ID ||
    (props.authType.length === 1 && props.authType[0] === AuthType.OPEN_ID)
  ) {
    sessionStorage.removeItem('current_auth_type');
    return (
      <div>
        {props.divider}
        <EuiButtonEmpty
          data-test-subj="log-out-2"
          color="danger"
          size="xs"
          href={`${props.http.basePath.serverBasePath}${OPENID_AUTH_LOGOUT}`}
        >
          Log out
        </EuiButtonEmpty>
      </div>
    );
  } else if (
    currentAuthType === AuthType.SAML ||
    (props.authType.length === 1 && props.authType[0] === AuthType.SAML)
  ) {
    sessionStorage.removeItem('current_auth_type');
    return (
      <div>
        {props.divider}
        <EuiButtonEmpty
          data-test-subj="log-out-1"
          color="danger"
          size="xs"
          onClick={() => samlLogout(props.http)}
        >
          Log out
        </EuiButtonEmpty>
      </div>
    );
  } else if (props.authType.length === 1 && props.authType[0] === AuthType.PROXY) {
    return <div />;
  } else {
    return (
      <div>
        {props.divider}
        <EuiButtonEmpty
          data-test-subj="log-out-3"
          color="danger"
          size="xs"
          onClick={() => logout(props.http, props.logoutUrl)}
        >
          Log out
        </EuiButtonEmpty>
      </div>
    );
  }
}
