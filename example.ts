import { Collection } from './src/collection';
import * as assert from 'assert'
import { Client } from './src/client'
import { Db } from './src/db'

/**
 *
 * Here I imported the Client Options code and modified it so that I can get
 * inherited properties to work, meaning in this version of the code db and
 * collection take everything that client can take as far as options, I have not
 * gone through the extra effort to add in db-specific and collection-specific
 * options, nor have I gone through the extra effort of limiting what these
 * functions can take.
 *
 * I am trying to demonstrate how options can be cloned and passed down into
 * their child, eg client -> db, or db -> collection, and how things can remain
 * immutable.
 *
 * The WriteConcern class is an example of a class that resolves
 * itself, and allows it to be easily converted and appended to the command. The
 * same treatment would go for readPreference or any other nested property in a
 * command that is an object.
 *
 * What this demo lacks:
 *
 * 1) Session details
 * 2) Server-selection details
 * 3) BSON Options interface, what options specifically should get passed in
 *    from user-facing options to command-specific options, these options should
 *    have a clear interface that the `Query` and `Msg` classes would accept.
 *
 * This demo defines types for all user-input options, as well as types for all
 * server-commands, these processes bookend the operation layer, but are
 * essential to it's success. Well defined starting types, and well-defined
 * ending types require less code-checks through the rest of the code base, and
 * ensure types will be correct given command. The immutability of theses types
 * ensures that they can't change unnecessarily along the way.
 *
 */
(async () => {
  const client = await Client.connect('localhost/?ssl=true&journal=true', { w: 'majority', readPreference: 'primary' })
  const db = client.db('database', { readPreference: 'secondary' })
  const collection = db.collection('collection', { readPreference: 'secondaryPreferred' })
  // this doesn't the operation, it only returns the command
  const command = await collection.findAndModify()

  assert.strictEqual(client.options.readPreference.mode, 'primary')
  assert.strictEqual(db.options.readPreference.mode, 'secondary')
  assert.strictEqual(collection.options.readPreference.mode, 'secondaryPreferred')
  assert.deepStrictEqual(command, {
    findAndModify: 'collection',
    '$readPreference': { mode: 'secondaryPreferred' },
    '$db': 'database',
    sort: [],
    update: {},
    writeConcern: { w: 'majority', j: true }
  })
  assert.strictEqual(command.writeConcern.j, true)
  assert.strictEqual(command.$readPreference.mode, 'secondaryPreferred')
  assert.strictEqual(command.writeConcern.w, 'majority')

  // demonstrates manually passing in parent to child
  const _db = new Db({ name: 'db', client, options: { readPreference: 'primaryPreferred' }})
  const _collection = new Collection({ name: 'db', db: _db })
  const _command = await _collection.findAndModify()
  assert.strictEqual(_command.$readPreference.mode, 'primaryPreferred')

})()
