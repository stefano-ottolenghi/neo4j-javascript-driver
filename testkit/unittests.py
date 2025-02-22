"""
Executed in Javascript driver container.
Responsible for running unit tests.
Assumes driver has been setup by build script prior to this.
"""
from common import is_deno, run_in_driver_repo, is_lite


if __name__ == "__main__":
    if is_lite() or is_deno():
        ignore = "--ignore=neo4j-driver"
    else:
        ignore = "--ignore=neo4j-driver-lite"

    run_in_driver_repo(["npm", "run", "lint"])
    run_in_driver_repo(["npm", "run", "test::unit", "--", ignore])
