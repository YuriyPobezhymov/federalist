import React from 'react';
import moment from 'moment'
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PublishedState from '../../../../frontend/components/siteList/publishedState';

const PUBLISHED_BASE = 'Please wait for build to complete or check logs for error message.';
const MOST_RECENT_BUILD_TIME = "2015-09-04T15:11:23.000Z"
const FORMATTED_MOST_RECENT_BUILD_TIME =  moment(MOST_RECENT_BUILD_TIME).format('MMMM Do YYYY, h:mm:ss a')
const MOST_RECENT_BUILD = `This site was last published at ${FORMATTED_MOST_RECENT_BUILD_TIME}.`;

let wrapper;

describe('<PublishedState />', () => {

  it('displays a fallback message if the site has no builds', () => {
    wrapper = shallow(<PublishedState />);

    expect(wrapper.find('p').text()).to.equal(PUBLISHED_BASE);
  });

  it('displays a fallback if build times cant be determined properly', () => {
    wrapper = shallow(<PublishedState site={{ publishedAt: undefined }} />);

    expect(wrapper.find('p').text()).to.equal(PUBLISHED_BASE);
  });

  it('displays the datetime of the most recent build', () => {
    wrapper = shallow(<PublishedState site={{ publishedAt: MOST_RECENT_BUILD_TIME }} />);

    expect(wrapper.find('p').text()).to.equal(MOST_RECENT_BUILD);
  });
});
