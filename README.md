# Limits SDK



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

# Limits SDK

A TypeScript SDK for interacting with the Limits trading platform API. This SDK provides type-safe methods for trading operations, account management, and TWAP orders.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🚀 **Easy to Use**: Simple, intuitive API for all trading operations
- 📦 **Batch Operations**: Support for batch order creation
- ⚡ **TWAP Orders**: Time-Weighted Average Price order support
- 🔧 **Error Handling**: Comprehensive error handling with detailed error types
- 🌐 **HTTP Client**: Built-in HTTP client with request/response interceptors
- 📚 **Well Documented**: Extensive documentation and examples

## Installation

```bash
npm install limits-sdk
```

## Quick Start

```typescript
import { LimitsSDK } from 'limits-sdk';

// Initialize the SDK
const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com',
  timeout: 30000,
  headers: {
    'Authorization': 'Bearer your-token', // if required
  },
});

// Create a market buy order
const result = await sdk.createOrder({
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
});
```

## API Reference

### Trading Operations

#### Create Order

```typescript
const orderResult = await sdk.createOrder({
  userAddress: '0x...',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  limit_px: 50000,
  order_type: {
    limit: { tif: 'Gtc' }
  }
});
```

#### Batch Orders

```typescript
const batchResult = await sdk.createBatchOrders({
  orders: [
    {
      userAddress: '0x...',
      coin: 'BTC',
      is_buy: true,
      sz: 1.0,
      reduce_only: false,
    },
    {
      userAddress: '0x...',
      coin: 'ETH',
      is_buy: false,
      sz: 2.0,
      reduce_only: false,
    }
  ]
});
```

#### Update Leverage

```typescript
const leverageResult = await sdk.updateLeverage({
  userAddress: '0x...',
  coin: 'BTC',
  leverage: 10,
  leverageType: 'cross'
});
```

#### TWAP Orders

```typescript
const twapResult = await sdk.createTwapOrder({
  userAddress: '0x...',
  token: 'BTC',
  size: '1.0',
  frequency: '5',   // 5 minutes
  runtime: '60',    // 60 minutes total
  randomize: true,
  isBuy: true,
  threshold: 0.01,
});
```

### Account Management

#### Connect User

```typescript
const connectResult = await sdk.connectUser({
  userAddress: '0x...',
  devicePublicKey: 'your-device-public-key',
});
```

#### Verify Device

```typescript
const verifyResult = await sdk.verifyDevice({
  signature: 'signature-string',
  nonce: 'nonce-string',
  agentAddress: '0x...',
  userAddress: '0x...',
  chainId: 1,
});
```

#### Verify Keys

```typescript
const keyVerifyResult = await sdk.verifyKeys({
  userAddress: '0x...',
  agentAddress: '0x...',
});
```

#### Verify Invite Code

```typescript
const codeVerifyResult = await sdk.verifyCode({
  userAddress: '0x...',
  inviteCode: 'invite-code',
});
```

## Types

The SDK exports all types used in the API:

```typescript
import {
  OrderRequest,
  TwapRequest,
  LeverageRequest,
  ConnectUserRequest,
  VerifyDeviceRequest,
  OrderType,
  Grouping,
  SDKError,
} from 'limits-sdk';
```

## Error Handling

The SDK provides detailed error information:

```typescript
import { SDKError } from 'limits-sdk';

try {
  const result = await sdk.createOrder(orderRequest);
} catch (error) {
  if (error instanceof Error) {
    const sdkError = error as SDKError;
    
    console.error('Error:', sdkError.message);
    console.error('Code:', sdkError.code);
    console.error('Status:', sdkError.status);
    console.error('Response:', sdkError.response);
  }
}
```

## Configuration

```typescript
interface LimitsSDKConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Authorization': 'Bearer your-token',
    'X-API-Key': 'your-api-key',
  },
});
```

## Examples

Check out the [examples](./examples) directory for more detailed usage examples:

- [Basic Usage](./examples/basic-usage.ts) - Simple trading operations
- [README Examples](./examples/README.md) - Comprehensive examples with explanations

## API Endpoints

The SDK covers all the main API endpoints:

- `POST /order` - Create single order
- `POST /batchOrder` - Create batch orders
- `POST /leverage` - Update leverage
- `POST /twap` - Create TWAP order
- `POST /connect` - Connect user
- `PUT /connect` - Verify keys
- `POST /verifyDevice` - Verify device
- `POST /verifyCode` - Verify invite code

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run typecheck
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the repository.

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/coinrule-v2/dev/common/limits-sdk/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
