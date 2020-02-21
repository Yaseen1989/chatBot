import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';
import axios from 'axios';


class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
      searchText: ""
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    const search = steps.search.value;
    let searchText;

    const human = ['human', 'person', 'agent', 'live', 'machine'];
    const itinerary = ['route', 'itinerary', 'travel', 'plan', 'schedule'];
    const flight = ['plane', 'flight'];
    const hotel = ['hotel', 'stay', 'staying'];
    const car = ['car', 'rental', 'transportation'];
    const help = ['help'];

    human.some(function(v) { 
        if (search.indexOf(v) >= 0) {
            searchText = 'human';
        } 
    });
    itinerary.some(function(v) { 
        if (search.indexOf(v) >= 0) {
            searchText = 'itinerary';
        } 
    });
    flight.some(function(v) { 
        if (search.indexOf(v) >= 0) {
            searchText = 'flight';
        } 
    });
    hotel.some(function(v) { 
        if (search.indexOf(v) >= 0) {
            searchText = 'flight';
        } 
    });
    car.some(function(v) { 
        if (search.indexOf(v) >= 0) {
            searchText = 'car';
        } 
    });
    help.some(function(v) {
        if (search.indexOf(v) >= 0) {
            searchText = 'help';
        } 
    });

    this.setState({
        searchText:searchText
    })

    console.log('Yaseen', this.state.searchText);

    const queryUrl = 'https://api-ctmvirtualassistant.azurewebsites.net/api/ctmva';

    var params = {
        "responseId": "ea3d77e8-ae27-41a4-9e1d-174bd461b68c",
        "session": "projects/your-agents-project-id/agent/sessions/88d13aa8-2999-4f71-b233-39cbf3a824a0",
        "queryResult": {
          "queryText": "user's original query to your agent",
          "parameters": {
            "name": "name"
          },
          "allRequiredParamsPresent": true,
          "fulfillmentText": "Text defined in Dialogflow's console for the intent that was matched",
          "fulfillmentMessages": [
            {
              "text": {
                "text": [
                  "Text defined in Dialogflow's console for the intent that was matched"
                ]
              }
            }
          ],
          "outputContexts": [
            {
              "name": "projects/your-agents-project-id/agent/sessions/88d13aa8-2999-4f71-b233-39cbf3a824a0/contexts/generic",
              "lifespanCount": 5,
              "parameters": {
                "param": "param value"
              }
            }
          ],
          "intent": {
            "name": "projects/your-agents-project-id/agent/intents/29bcd7f8-f717-4261-a8fd-2d3e451b8af8",
            "displayName": `${searchText}`
          },
          "intentDetectionConfidence": 1,
          "diagnosticInfo": {},
          "languageCode": "en"
        },
        "originalDetectIntentRequest": {}
      }

      axios.post(queryUrl, params)
      .then(res => {
        this.setState({ loading: false, result: (this.state.searchText === 'help') ? <Link /> : res.data.fulfillmentText });
      })
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div className="dbpedia">
        { loading ? <Loading /> : result }
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

const Link = () => {
    return (<a href="https://www.google.com">google.com</a>)
}

const ChatBotAPI = () => (
  <ChatBot
    steps={[
      {
        id: '1',
        message: 'Type something to search on CTM. (Ex.: help)',
        trigger: 'search',
      },
      {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        waitAction: false,
        trigger: 'search',
      },
    ]}
  />
);

export default ChatBotAPI;