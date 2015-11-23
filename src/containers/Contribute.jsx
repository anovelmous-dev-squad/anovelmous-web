import React from 'react';
import Relay from 'react-relay';
import Chapter from './Chapter';
import { Tabs, Tab } from 'material-ui';

class Contribute extends React.Component {
  static propTypes = {
    novel: React.PropTypes.object.isRequired,
    chapter: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { tabsValue: props.chapter.id };
  }

  _handleChapterChange = (chapterId) => {
    this.setState({tabsValue: chapterId});
  }

  renderTab (chapter) {
    return (
      <Tab key={chapter.id} label={chapter.title} value={chapter.id}>
        <Chapter chapter={chapter} allowContribute />
      </Tab>
    );
  }

  render () {
    const { novel } = this.props;
    return (
      <div>
        <Tabs
          valueLink={{value: this.state.tabsValue,
                      requestChange: this._handleChapterChange.bind(this)}}
          >
          {novel.chapters.edges.map(edge => (
            this.renderTab(edge.node)
          ))}
        </Tabs>
      </div>
    );
  }
}

export default Relay.createContainer(Contribute, {
  initialVariables: {
    chapterId: null
  },
  fragments: {
    novel: () => Relay.QL`
      fragment on Novel {
        id
        title
        chapters(last: 10) {
          edges {
            node {
              id
              title
              ${Chapter.getFragment('chapter')}
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Query {
        chapter(id: chapterId) {
          id
          title
        }
      }
    `
  }
});
