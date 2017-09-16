"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPostSummary({ id, userId, description }) {
    return { id, description };
}
exports.createPostSummary = createPostSummary;
function createPostsSummaries(data) {
    return data.map(createPostSummary);
}
exports.createPostsSummaries = createPostsSummaries;
