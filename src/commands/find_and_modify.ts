import { MongoDB } from "../types";
import { Server } from '../server';
import { Command } from './command';

export class FindAndModifyCommand extends Command<
  MongoDB.CommandClassOption.FindAndModify,
  MongoDB.Command.FindAndModify
> {
  retryable = true
  write = true
  read = true

  constructor(options: MongoDB.CommandClassOption.FindAndModify) {
    super(options)
  }

  get bsonOptions () {
    return {
      serializeFunctions: false,
      checkKeys: false
    }
  }

  command (server: Server): MongoDB.Command.FindAndModify {
    const options = this.options
    // const wireVersion = new WireVersion(server.wireVersion)

    const updateOrRemove = () => {
      if (options.update) return { update: options.update }
      if (options.remove) return { remove: options.remove }
      throw new Error("find and modify requires either remove or update")
    }

    // wireVersion.above(8) do something

    const command = {
      findAndModify: options.findAndModify,
      $db: options.$db,
      sort: options.sort || [],
      ...updateOrRemove(),
      ...(options.new) ? { new: options.new } : {},
      ...((options.$readPreference) ? { $readPreference: options.$readPreference } : {}),
      ...((options.writeConcern) ? { writeConcern: options.writeConcern } : {}),
    }
    Object.freeze(command)
    return command;
  }

}