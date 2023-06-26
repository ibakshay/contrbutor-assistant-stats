import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types';

@Injectable()
export class AppService {
  private readonly octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_PAT,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getContributors() {
    let response: RestEndpointMethodTypes['repos']['listContributors']['response'];
    try {
      response = await this.octokit.repos.listContributors({
        owner: 'contributor-assistant',
        repo: 'github-action',
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return {
      totalNoOfContributors: response.data.length,
      contributors: response.data.map((contributor) => contributor.login),
    };
  }
}
