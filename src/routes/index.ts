import { Hono } from 'hono';
import searchRoute from './search';
import animeRoute from './anime';
import episodesRoute from './episodes';
import serversRoute from './servers';
import streamRoute from './stream';
import proxyRoute from './proxy';
import homeRoute from './home';
import recentRoute from './recent';

const api = new Hono();

api.route('/search', searchRoute);
api.route('/anime', animeRoute);
api.route('/episodes', episodesRoute);
api.route('/servers', serversRoute);
api.route('/stream', streamRoute);
api.route('/proxy', proxyRoute);
api.route('/home', homeRoute);
api.route('/recent', recentRoute);

export default api;
