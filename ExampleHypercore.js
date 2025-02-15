// Import the Hypercore module
const Hypercore = require('hypercore');
const RAM = require('random-access-memory');

// Create a Hypercore instance with in-memory storage
const core = new Hypercore((filename) => new RAM(), { valueEncoding: 'utf-8' });

async function main() {
  // Wait for the Hypercore instance to be ready
  await core.ready();

  // Append data to the Hypercore log
  await core.append('First entry in the log.');
  await core.append('Second entry in the log.');

  // Retrieve and display data from the log
  const firstEntry = await core.get(0);
  const secondEntry = await core.get(1);

  console.log('Entry 0:', firstEntry);
  console.log('Entry 1:', secondEntry);

  // Create a read stream to iterate over all entries
  const stream = core.createReadStream();
  stream.on('data', (data) => {
    console.log('Streamed entry:', data);
  });

  // Handle events for data upload and download
  core.on('upload', (index, byteLength, peer) => {
    console.log(`Uploaded block ${index} (${byteLength} bytes) to peer ${peer.remoteAddress}`);
  });

  core.on('download', (index, byteLength, peer) => {
    console.log(`Downloaded block ${index} (${byteLength} bytes) from peer ${peer.remoteAddress}`);
  });

  // Simulate replication by creating a second Hypercore instance
  const clone = new Hypercore((filename) => new RAM(), core.key, { valueEncoding: 'utf-8' });
  await clone.ready();

  // Replicate data between the original and the clone
  const replicate = (a, b) => {
    const stream = a.replicate(true);
    stream.pipe(b.replicate(false)).pipe(stream);
  };

  replicate(core, clone);

  // Wait for the clone to download the data
  clone.on('download', async (index) => {
    const data = await clone.get(index);
    console.log(`Clone received block ${index}:`, data);
  });

  // Append more data to the original log
  await core.append('Third entry in the log.');
}

main().catch(console.error);
