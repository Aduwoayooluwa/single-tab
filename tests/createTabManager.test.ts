import { createTabManager } from "../src/core/tabManager";

describe("createTabManager", () => {
  beforeEach(() => {
    // Clear sessionStorage and mocks before each test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("should register the first tab and not trigger duplicate detection", () => {
    const onDuplicateMock = jest.fn();

    // Create the first tab (Tab A)
    const tabManager = createTabManager("test-app", onDuplicateMock);

    // Ensure no duplicate warning is triggered on the first tab
    expect(onDuplicateMock).not.toHaveBeenCalled();

    // Clean up
    tabManager.cleanup();
  });

  it("should trigger duplicate callback ONLY on the second tab (Tab B)", () => {
    const onDuplicateMockA = jest.fn(); // First tab's callback
    const onDuplicateMockB = jest.fn(); // Second tab's callback

    // Simulate the first tab (Tab A)
    createTabManager("test-app", onDuplicateMockA);

    // Simulate the second tab (Tab B)
    const tabManager2 = createTabManager("test-app", onDuplicateMockB);

    // Tab A should NOT receive the duplicate warning
    expect(onDuplicateMockA).not.toHaveBeenCalled();

    // Tab B should receive the duplicate warning
    expect(onDuplicateMockB).toHaveBeenCalled();

    // Clean up
    tabManager2.cleanup();
  });

  it("should unregister a tab and allow a new one to become primary", () => {
    const onDuplicateMock = jest.fn();

    // Simulate the first tab (Tab A)
    const tabManager = createTabManager("test-app", onDuplicateMock);

    // Clean up (close Tab A)
    tabManager.cleanup();

    // Simulate opening a new tab (which should become the primary tab now)
    const tabManager2 = createTabManager("test-app", onDuplicateMock);

    // No duplicate should be detected since Tab A was closed
    expect(onDuplicateMock).not.toHaveBeenCalled();

    // Clean up
    tabManager2.cleanup();
  });

});
