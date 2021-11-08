/**
 * @fileoverview storiesOf is deprecated and should not be used
 * @author Yann Braga
 */

import { CategoryId } from '../utils/constants'
import { createStorybookRule } from '../utils/create-storybook-rule'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createStorybookRule({
  name: '',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'storiesOf is deprecated and should not be used',
      categories: [CategoryId.CSF_STRICT],
      recommended: 'error',
    },
    messages: {
      doNotUseStoriesOf: 'storiesOf is deprecated and should not be used',
    },
    schema: [],
  },

  create(context: any) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportSpecifier(node: any) {
        if (node.imported.name === 'storiesOf') {
          context.report({
            node,
            messageId: 'doNotUseStoriesOf',
          })
        }
      },
    }
  },
})
