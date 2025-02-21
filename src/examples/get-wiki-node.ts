import { WikiService } from '../services/wiki-service';

async function main() {
  const wikiService = new WikiService();
  
  try {
    const nodeInfo = await wikiService.getWikiNode('Fv2OwmQISi5fOtkIuX2cF0vKnXg');
    console.log('Node info:', nodeInfo);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 