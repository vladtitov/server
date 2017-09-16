

import {PostModel} from '../model/model';
import * as Bluebird from "bluebird";
import {createPostsSummaries, PostSummary} from '../../shared/model/posts-summary';


export function findAllPosts() : Bluebird<PostSummary[]>  {
    return PostModel.findAll({
      //  order: ['seqNo']
    })
    .then((res:any[]) => res.map(function (item) {
      return {id:item.id, description:item.description};
    }));
}