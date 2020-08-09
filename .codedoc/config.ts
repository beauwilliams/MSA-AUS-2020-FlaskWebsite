
import { configuration } from '@codedoc/core';

import { theme } from './theme';


export const config = /*#__PURE__*/configuration({
  theme,                                  // --> add the theme. modify `./theme.ts` for chaning the theme.
  dest: {
    namespace: '/MSA-AUS-2020-FlaskWebsite'// --> your github pages namespace. remove if you are using a custom domain.
  },
  page: {
    title: {
      base: 'MSA AUS 2020 FlaskWebsite'   // --> the base title of your doc pages
    }
  },
  misc: {
    github: {
      user: 'beauwilliams',               // --> your github username (where your repo is hosted)
      repo: 'MSA-AUS-2020-FlaskWebsite',  // --> your github repo name
    }
  },
});
