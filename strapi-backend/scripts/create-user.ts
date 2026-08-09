import { createStrapi } from '@strapi/strapi';

async function main() {
  const appContext = await createStrapi({ distDir: './dist' });
  const strapi = await appContext.load();

  try {
    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!role) {
      console.error('Authenticated role not found.');
      process.exitCode = 1;
      return;
    }

    const email = 'jamuna2580james@gmail.com';
    const existing = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({ where: { email } });

    if (existing) {
      await strapi.plugin('users-permissions').service('user').edit(existing.id, {
        password: 'Qwert@123',
        confirmed: true,
      });
      console.log('Updated password for existing user:', email);
      return;
    }

    await strapi.plugin('users-permissions').service('user').add({
      username: 'jamuna',
      email,
      password: 'Qwert@123',
      role: role.id,
      confirmed: true,
      provider: 'local',
    });
    console.log('Created users-permissions auth user:', email);
  } catch (error) {
    console.error('Failed to create user:', error);
    process.exitCode = 1;
  } finally {
    await strapi.destroy();
  }
}

main();
