import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  ACCESS_KEY: string = "8KvAs3BiUUdPujLxZoqVqQUJstregjoPX3WyLfTINiw";

  @State() imgSrc: string;

  async componentWillLoad() {
    this.imgSrc = await this.getCityPhoto("london");
  }

  private getCityPhoto(city: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
      const searchUrl: string = 
                      'https://api.unsplash.com/search/photos' +
                      `?query=${city}` +
                      '&per_page=100' +
                      `&client_id=${this.ACCESS_KEY}`;
      
      try {
        const rawResponse: Response = await fetch(searchUrl);

        const response = JSON.parse(await rawResponse.text());

        if (!response) {
          resolve(undefined);
          return;
        }

        const max = response.results.length;
        const randomId = Math.floor(Math.random() * max);

        await this.registerDownload(response.results[randomId].id);

        resolve(response.results[0].urls && response.results[randomId].urls.regular ? response.results[randomId].urls.regular : undefined);
      } catch(err) {
        resolve(undefined);
      }
    });
  }

  private registerDownload(photoId: string) {
    return new Promise<void>(async (resolve) => {
      const downloadUrl: string = 
        'https://api.unsplash.com/' +
        `photos/${photoId}/download/` +
        `?client_id=${this.ACCESS_KEY}`;
      
      try {
        await fetch(downloadUrl);

        resolve();
      } catch(err) {
        resolve();
      }
    });
  }

  render() {
    return this.imgSrc ? <img src={this.imgSrc}/> : undefined;
  }
}
