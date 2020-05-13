const { DuplicatedResourceError, ResourceNotFoundError } = require('../errors');
const { User, Role } = require('../models');

module.exports = ({

    create: async (req, res, next) => {
        try {
          const { name, nickname, email, roleName } = req.body;
    
          const duplicatedCount = await User.count({ email });
          if (duplicatedCount !== 0) {
            throw new DuplicatedResourceError();
          }
    
          let roleId;
    
          const role = await Role.find({ name: roleName });
          if (role) {
            roleId = role._id;
          } else {
            const newRole = await Role.create({
              name: roleName,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            roleId = newRole._id;
          }
    
          const user = await User.create({
            name,
            nickname,
            email,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: roleId,
          });
    
          res.send(user);
        } catch (err) {
          next(err);
        }
    },

    get: async (req, res, next) => {
        try {
          res.send(await User.find(req.query));
        } catch (err) {
          next(err);
        }
    },


    getById: async (req, res, next) => {
        try {
          const user = await User.findById(req.params.id);
          if (!user) {
            throw new ResourceNotFoundError();
          }
          res.send(user);
        } catch (err) {
          next(err);
        }
    },


    delete: async (req, res, next) => {
        try {
          await User.deleteOne({ _id: req.params.id });
          res.sendStatus(204);
        } catch (err) {
          next(err);
        }
      }

});