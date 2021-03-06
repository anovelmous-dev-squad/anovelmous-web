import { Route, IndexRoute } from 'react-router';
import React from 'react';
import Relay from 'react-relay';
import CoreLayout from 'layouts/CoreLayout';
import ContributeView from 'views/ContributeView';
import HomeView from 'views/HomeView';
import StatsView from 'views/StatsView';
import Chapter from 'containers/Chapter';
import PlotDetailDialog from 'containers/PlotDetailDialog';
import PrewritingView from 'views/PrewritingView';
import LoadingLarge from 'components/LoadingLarge';

const CONTRIBUTOR_ID = 'Q29udHJpYnV0b3I6MQ==';

const viewerQueryConfig = {
  viewer: () => Relay.QL`query { viewer }`
};

const contributeQueryConfig = {
  contributor: () => Relay.QL`query { contributor(id: $contributorId) }`,
  novel: () => Relay.QL`query { novel(id: $novelId) }`,
  novels: () => Relay.QL`query { novels }`,
};

const prewritingQueryConfig = {
  contributor: () => Relay.QL`query { contributor(id: $contributorId) }`,
  novel: () => Relay.QL`query { novel(id: $novelId) }`
};

const chapterQueryConfig = {
  chapter: () => Relay.QL`query { chapter(id: $chapterId) }`
};

const plotQueryConfig = {
  novel: () => Relay.QL`query { novel(id: $novelId) }`
};

const prepareContributeParams = (params) => {
  return {
    ...params,
    contributorId: CONTRIBUTOR_ID,
  };
};

export default (
  <Route path="/" component={CoreLayout}>
    <IndexRoute component={HomeView} queries={viewerQueryConfig} />
    <Route
      name="contribute"
      path="contribute/novel/:novelId"
      queries={contributeQueryConfig}
      stateParams={['contributorId']}
      prepareParams={prepareContributeParams}
      component={ContributeView}
      renderLoading={() => <LoadingLarge />}
      >
      <Route
        name="chapter"
        path="chapter/:chapterId"
        queries={chapterQueryConfig}
        component={Chapter}
        renderLoading={() => <LoadingLarge />}
        >
        <Route
          name="plot"
          path="plot/"
          queries={plotQueryConfig}
          component={PlotDetailDialog}
          />
      </Route>
      <Route
        name="prewriting"
        path="prewriting/"
        queries={prewritingQueryConfig}
        component={PrewritingView}
        renderLoading={() => <LoadingLarge />}
        />
    </Route>
    <Route
      name="stats"
      path="stats/"
      component={StatsView}
      queries={contributeQueryConfig}
      stateParams={['contributorId']}
      prepareParams={prepareContributeParams}
      renderLoading={() => <LoadingLarge />}
    />
  </Route>
);
