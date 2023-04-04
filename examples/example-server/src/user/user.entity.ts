export class User {
  constructor(private projectRepository: any) {}

  getSomething() {
    return this.projectRepository.getSomething();
  }
}
