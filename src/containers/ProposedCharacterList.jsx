import React from 'react';
import Relay from 'react-relay';
import ScoreCard from 'components/ScoreCard';


class ProposedCharacterList extends React.Component {
  static propTypes = {
    contributor: React.PropTypes.object.isRequired,
    characters: React.PropTypes.object.isRequired,
  };

  renderPlotCard(character) {
    return (
      <ScoreCard
        id={character.id}
        title={character.firstName}
        description={character.bio}
        onUpvote={(id) => console.log(id)}
        />
    );
  }

  render() {
    const { characters } = this.props;
    return (
      <div>
        {characters.edges.map(edge => this.renderPlotCard(edge.node))}
      </div>
    );
  }
}

export default Relay.createContainer(ProposedCharacterList, {
  fragments: {
    contributor: () => Relay.QL`
      fragment on Contributor {
        id
        username
      }
    `,
    characters: () => Relay.QL`
      fragment on CharacterConnection {
        edges {
          node {
            id
            firstName
            bio
          }
        }
      }
    `
  }
});