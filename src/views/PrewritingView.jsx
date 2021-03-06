import React from 'react';
import Relay from 'react-relay';
import ProposedPlotList from 'containers/ProposedPlotList';
import ProposedCharacterList from 'containers/ProposedCharacterList';
import ProposedPlaceList from 'containers/ProposedPlaceList';
import ProposedPlotItemList from 'containers/ProposedPlotItemList';
import CharacterCreator from 'components/CharacterCreator';
import PlaceCreator from 'components/PlaceCreator';
import PlotItemCreator from 'components/PlotItemCreator';
import PlotCreator from 'components/PlotCreator';
import CreateCharacterMutation from 'mutations/CreateCharacterMutation';
import CreatePlaceMutation from 'mutations/CreatePlaceMutation';
import CreatePlotItemMutation from 'mutations/CreatePlotItemMutation';
import CreatePlotMutation from 'mutations/CreatePlotMutation';
import UpdateVoteScoreMutation from 'mutations/UpdateVoteScoreMutation';

import { Tabs, Tab, Paper } from 'material-ui';

class PrewritingView extends React.Component {
  static propTypes = {
    contributor: React.PropTypes.object.isRequired,
    novel: React.PropTypes.object.isRequired
  };

  _handlePlotCreation = (summary) => {
    Relay.Store.update(
      new CreatePlotMutation({
        summary,
        novel: this.props.novel,
        contributor: this.props.contributor
      })
    );
  };

  _handleCharacterCreation = ({ firstName, lastName, bio }) => {
    Relay.Store.update(
      new CreateCharacterMutation({
        firstName,
        lastName,
        bio,
        novel: this.props.novel,
        contributor: this.props.contributor
      })
    );
  };

  _handlePlaceCreation = ({ name, description }) => {
    Relay.Store.update(
      new CreatePlaceMutation({
        name,
        description,
        novel: this.props.novel,
        contributor: this.props.contributor
      })
    );
  };

  _handlePlotItemCreation = ({ name, description }) => {
    Relay.Store.update(
      new CreatePlotItemMutation({
        name,
        description,
        novel: this.props.novel,
        contributor: this.props.contributor
      })
    );
  };

  _updateVoteScore(resourceId, addend) {
    const { contributor } = this.props;
    Relay.Store.update(
      new UpdateVoteScoreMutation({
        resourceId, contributor, addend
      })
    );
  }

  _handleUndoVote = (plotId) => {
    this._updateVoteScore(plotId, 0);
  }

  _handleUpvote = (plotId) => {
    this._updateVoteScore(plotId, 1);
  }

  _handleDownvote = (plotId) => {
    this._updateVoteScore(plotId, -1);
  }

  _getCurrentStageView = (stage) => {
    switch (stage.name) {
    case 'BRAINSTORMING':
      return this.renderBrainstormingStage();
    case 'PLOT SUMMARY':
      return this.renderPlotSummaryStage();
    case 'STRUCTURE CREATION':
      return this.renderStructureCreationStage();
    case 'TITLE DECISION':
      return this.renderTitleDecisionStage();
    default:
      return <p>this should not happen.</p>;
    }
  };

  renderBrainstormingStage() {
    return <div>Think about the upcoming novel.</div>;
  }

  renderPlotSummaryStage() {
    const { novel, contributor } = this.props;
    return (
      <div>
        <ProposedPlotList
          plots={novel.proposedPlots}
          contributor={contributor}
          onUpvote={this._handleUpvote}
          onDownvote={this._handleDownvote}
          onUndoVote={this._handleUndoVote}
          />
        <PlotCreator maxSummaryLength={3000} onCreate={this._handlePlotCreation} />
      </div>
    );
  }

  renderStructureCreationStage() {
    const { novel, contributor } = this.props;
    return (
        <Tabs>
          <Tab label="Create a Character">
            <ProposedCharacterList
              characters={novel.proposedCharacters}
              contributor={contributor}
              onUpvote={this._handleUpvote}
              onDownvote={this._handleDownvote}
              onUndoVote={this._handleUndoVote}
              />
            <CharacterCreator onCreate={this._handleCharacterCreation}/>
          </Tab>
          <Tab label="Create a Place">
            <ProposedPlaceList
              places={novel.proposedPlaces}
              contributor={contributor}
              onUpvote={this._handleUpvote}
              onDownvote={this._handleDownvote}
              onUndoVote={this._handleUndoVote}
              />
            <PlaceCreator onCreate={this._handlePlaceCreation}/>
          </Tab>
          <Tab label="Create a Plot Item">
            <ProposedPlotItemList
              plotItems={novel.proposedPlotitems}
              contributor={contributor}
              onUpvote={this._handleUpvote}
              onDownvote={this._handleDownvote}
              onUndoVote={this._handleUndoVote}
              />
            <PlotItemCreator onCreate={this._handlePlotItemCreation}/>
          </Tab>
        </Tabs>
    );
  }

  renderTitleDecisionStage() {
    return <div>Vote on novel title</div>;
  }

  render() {
    const { novel } = this.props;
    return (
      <div>
        {this._getCurrentStageView(novel.stage)}
      </div>
    );
  }
}

export default Relay.createContainer(PrewritingView, {
  fragments: {
    contributor: () => Relay.QL`
      fragment on Contributor {
        id
        plots(first: 5) {
          edges {
            node {
              summary
            }
          }
        }
        characters(first: 5) {
          edges {
            node {
              firstName
              lastName
              bio
            }
          }
        }
        places(first: 5) {
          edges {
            node {
              name
              description
            }
          }
        }
        plotitems(first: 5) {
          edges {
            node {
              name
              description
            }
          }
        }
        ${ProposedPlotList.getFragment('contributor')}
        ${ProposedCharacterList.getFragment('contributor')}
        ${ProposedPlaceList.getFragment('contributor')}
        ${ProposedPlotItemList.getFragment('contributor')}
        ${CreatePlotMutation.getFragment('contributor')}
        ${CreateCharacterMutation.getFragment('contributor')}
        ${CreatePlaceMutation.getFragment('contributor')}
        ${CreatePlotItemMutation.getFragment('contributor')}
        ${UpdateVoteScoreMutation.getFragment('contributor')}
      }
    `,
    novel: () => Relay.QL`
      fragment on Novel {
        title
        stage {
          name
        }
        proposedPlots(first: 20) {
          ${ProposedPlotList.getFragment('plots')}
        }
        proposedCharacters(first: 20) {
          ${ProposedCharacterList.getFragment('characters')}
        }
        proposedPlaces(first: 20) {
          ${ProposedPlaceList.getFragment('places')}
        }
        proposedPlotitems(first: 20) {
          ${ProposedPlotItemList.getFragment('plotItems')}
        }
        ${CreatePlotMutation.getFragment('novel')}
        ${CreateCharacterMutation.getFragment('novel')}
        ${CreatePlaceMutation.getFragment('novel')}
        ${CreatePlotItemMutation.getFragment('novel')}
      }
    `
  }
});
